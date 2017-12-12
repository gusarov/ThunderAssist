ping 127.0.0.1
node -e "require('./autodeploy.js')()" >> autodeploy.log 2>&1