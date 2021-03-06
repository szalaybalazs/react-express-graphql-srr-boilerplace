curl --request POST \
  --url http://localhost:80/graphql \
  --header 'accept: application/json' \
  --header 'accept-encoding: gzip, deflate, br' \
  --header 'connection: keep-alive' \
  --header 'authorization: 5dcfc3e9269c60841381065a' \
  --header 'school: vpg' \
  --header 'dnt: 1' \
  --header 'origin: http://localhost:80/graphql' \
  --form 'operations={"query": "mutation uploadAvatar($file: Upload! $user: ID! $action: ActionType!) {  uploadAvatar(file: $file action: $action, user: $user) }",   "variables": { "file": null, "action": "CREATE", "user": "5dcfc3e9269c608413810659" } }' \
  --form 'map={ "nFile": ["variables.file"] }' \
  --form nFile=@horse-001.jpg