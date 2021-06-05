#!/bin/bash

while getopts a:f: flag
do
    case "${flag}" in
        a) access_token=${OPTARG};;
		f) file_name=${OPTARG};;
    esac
done

content=$(<richmenu-content.json)

curl -v -X POST https://api.line.me/v2/bot/richmenu \
-H "Authorization: Bearer {$access_token}" \
-H "Content-Type: application/json" \
-d "$content" \
-o richmenu-id.json

richMenuId=$(jq '.richMenuId' richmenu-id.json -r)

curl -v -X POST https://api-data.line.me/v2/bot/richmenu/$richMenuId/content \
-H "Authorization: Bearer {$access_token}" \
-H "Content-Type: image/jpeg" \
-T $file_name

curl -v -X POST https://api.line.me/v2/bot/user/all/richmenu/$richMenuId \
-H "Authorization: Bearer {$access_token}" \
-d ''

