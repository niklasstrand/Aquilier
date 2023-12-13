# Start with the official Go image.
FROM golang:1.18

# Set the working directory in the container.
WORKDIR /app

# Copy go.mod and go.sum files and download dependencies.
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code and the ABI file.
COPY . .

# Build the application.
RUN CGO_ENABLED=0 GOOS=linux go build -o proxy proxy.go

# Command to run when the container starts.
ENTRYPOINT ["./proxy"]
