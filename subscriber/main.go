package main

import (
	"context"
	"fmt"
	"os"

	"cloud.google.com/go/pubsub"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

var (
	projectID = os.Getenv("PROJECT_ID")
	keyfile   = os.Getenv("KEYFILE")
)

func main() {

	if projectID == "" {
		fmt.Println("No project ID defined, exiting!")
		os.Exit(1)
	}

	if keyfile == "" {
		fmt.Println("No keyfile defined, exiting!")
		os.Exit(1)
	}

	ctx := context.Background()

	client, err := pubsub.NewClient(ctx, projectID, option.WithCredentialsFile(keyfile))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	// List all subscriptions of the project.
	it := client.Subscriptions(ctx)
	for {
		sub, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		fmt.Println(sub)
	}
}
