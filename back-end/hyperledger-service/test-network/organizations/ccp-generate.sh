#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        /mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        /mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=7051
CAPORT=7054
PEERPEM=/mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
CAPEM=/mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > /mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > /mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml

ORG=2
P0PORT=9051
CAPORT=8054
PEERPEM=/mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
CAPEM=/mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > /mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > /mnt/d/Repository/Research_project_v1/agri-sync-v2/agri-sync/back-end/hyperledger-service/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml
