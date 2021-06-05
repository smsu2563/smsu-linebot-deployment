#!/bin/bash

while getopts a: flag
do
    case "${flag}" in
        a) ACCESS_TOKEN=${OPTARG};;
    esac
done

# List acquisition 
 existsMenus=$(
    curl -v -X GET https://api.line.me/v2/bot/richmenu/list \
	-H "Authorization: Bearer ${ACCESS_TOKEN}"
 )
 existsMenus=$(echo $existsMenus | jq ".richmenus")
 existsMenusLen=$(echo $existsMenus | jq length)


# One by one to delete 
 for i in $( seq 0 $(($existsMenusLen - 1)) ); do
    menu=$(echo $existsMenus | jq .[$i])
    menuId=$(echo $menu | jq ".richMenuId")
    menuId=$(echo {$menuId} | sed 's/"//g')

    curl -v -X DELETE https://api.line.me/v2/bot/richmenu/$menuId \
        -H "Authorization: Bearer $ACCESS_TOKEN"

 done