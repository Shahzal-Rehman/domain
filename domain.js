const axios = require('axios');
const msal = require('@azure/msal-node');

// Initialize MSAL client for token acquisition
const cca = new msal.ConfidentialClientApplication({
    auth: {
        clientId: '<Your_Client_Id>',       // Replace with your Application (client) ID
        authority: 'https://login.microsoftonline.com/<Tenant_Id>', // Replace with your Directory (tenant) ID
        clientSecret: '<Your_Client_Secret>' // Replace with your Application secret
    }
});

// Function to acquire the access token
async function getAccessToken() {
    const result = await cca.acquireTokenByClientCredential({
        scopes: ['https://management.azure.com/.default']
    });
    return result.accessToken;
}

// Function to delete a domain
async function deleteDomain() {
    const accessToken = await getAccessToken();

    // Construct the URL to the Azure Management API
    const url = `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DomainRegistration/domains/{domainName}?forceHardDeleteDomain=true&api-version=2024-04-01`;

    try {
        // Send DELETE request to Azure Management API
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        // Log success message
        console.log("Domain deleted successfully", response.data);
    } catch (error) {
        // Handle errors
        console.error("Failed to delete domain", error.response ? error.response.data : error.message);
    }
}

// Call the delete function
deleteDomain();
