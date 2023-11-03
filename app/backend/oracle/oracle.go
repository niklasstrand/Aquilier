package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	ganacheURL               = "ws://localhost:7545"
	bookingManagementAddress = "0xA3b71F79B146429aAC74F80950796e3D50430B38"
	homeAssistantAPIURL      = "http://localhost:8123/api/services/input_boolean/toggle"
	token                    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1M2ZmNjFkYzA1MWE0ZGM0YTM4NzIwMWY0MWY0MTRmYiIsImlhdCI6MTY5ODA2MTU1MCwiZXhwIjoyMDEzNDIxNTUwfQ.GyNUECFqs6cae0B1FyxUjE6K5qjNK-veuphsOpRUA9g"
)

type AccessGrantedEvent struct {
	BookingID   *big.Int
	UserAddress common.Address
}

func main() {
	client, err := ethclient.Dial(ganacheURL)
	if err != nil {
		log.Fatalf("Failed to connect to the Ethereum client: %v", err)
	}
	blockNumber, err := client.BlockNumber(context.Background())
	if err != nil {
		log.Fatalf("Failed to retrieve the latest block number: %v", err)
	}
	fmt.Printf("Latest block number: %d\n", blockNumber)

	var bookingManagementABIString = loadABI("/home/niklas/Documents/aquilier/app/backend/contract/BookingManagement.abi.json")

	contractABI, err := abi.JSON(bytes.NewReader([]byte(bookingManagementABIString)))
	if err != nil {
		log.Fatalf("Failed to parse contract ABI: %v", err)
	}

	contractAddress := common.HexToAddress(bookingManagementAddress)
	startBlockNumber := int64(1089)
	eventSignature := crypto.Keccak256Hash([]byte("AccessGranted(uint256,address)"))

	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
		FromBlock: big.NewInt(startBlockNumber),
		ToBlock:   nil,
		Topics:    [][]common.Hash{[]common.Hash{eventSignature}},
	}

	// Get historical logs
	historicalLogs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to retrieve logs: %v", err)
	}

	// Process historical logs
	for _, vLog := range historicalLogs {
		var eventData AccessGrantedEvent
		err := contractABI.UnpackIntoInterface(&eventData, "AccessGranted", vLog.Data)
		if err != nil {
			log.Printf("Failed to unpack event from historical log: %v", err)
			continue
		}
		fmt.Printf("Access Granted from historical log: BookingID: %s, UserAddress: %s\n", eventData.BookingID.String(), eventData.UserAddress.Hex())
		unlockVirtualLock()
	}

	// Create a channel to receive new logs
	logsChan := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logsChan)
	if err != nil {
		log.Fatalf("Failed to subscribe to contract events: %v", err)
	}
	defer sub.Unsubscribe()

	for {
		select {
		case err := <-sub.Err():
			log.Fatalf("Got error while receiving logs: %v", err)
		case vLog := <-logsChan:
			var eventData AccessGrantedEvent
			err := contractABI.UnpackIntoInterface(&eventData, "AccessGranted", vLog.Data)
			if err != nil {
				log.Printf("Failed to unpack event: %v", err)
				continue
			}

			fmt.Printf("Access Granted from subscription: BookingID: %s, UserAddress: %s\n", eventData.BookingID.String(), eventData.UserAddress.Hex())
			unlockVirtualLock()
		}
	}
}

func loadABI(path string) (bookingManagementABIString string) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read ABI from file: %v", err)
	}
	bookingManagementABIString = string(data)
	return bookingManagementABIString
}
func unlockVirtualLock() {
	data := map[string]string{
		"entity_id": "input_boolean.virtual_lock",
	}
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Printf("Failed to marshal data: %v", err)
		return
	}

	req, err := http.NewRequest("POST", homeAssistantAPIURL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to make request: %v", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("Virtual lock unlocked: %s\n", body)
}
