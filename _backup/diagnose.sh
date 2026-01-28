#!/bin/bash
echo "--- NODE VERSION ---"
node -v
echo "--- WHICH NODE ---"
which node
echo "--- EXPO CONFIG ---"
npx expo config --type public 2>&1
echo "--- EXPO UPDATES CHECK ---"
ls -d node_modules/expo-updates 2>&1
echo "--- DONE ---"
