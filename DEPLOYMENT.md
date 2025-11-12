# Red Hat Sandbox Deployment Guide

This guide will help you deploy the Krissi Pimpin' Pimpire gaming platform to Red Hat Sandbox (OpenShift).

## Prerequisites

1. **Red Hat Developer Account**: Sign up at https://developers.redhat.com/
2. **Red Hat Sandbox Access**: Access the sandbox at https://developers.redhat.com/developer-sandbox
3. **OpenShift CLI (oc)**: Download from your OpenShift console
4. **Docker/Podman**: For building container images

## Quick Start

### Step 1: Login to OpenShift

1. Go to your Red Hat Sandbox console
2. Click on your username (top right) → "Copy login command"
3. Click "Display Token" and copy the oc login command
4. Run the command in your terminal:

```bash
oc login --token=your_token --server=your_server_url
```

### Step 2: Create a New Project

```bash
oc new-project krissi-pimpin-pimpire
```

### Step 3: Set up Secrets

Before deploying, you need to create the Gemini API secret:

1. Get your Gemini API key from https://aistudio.google.com/app/apikey
2. Encode it to base64:
   ```bash
   echo -n "your_api_key_here" | base64
   ```
3. Edit `.openshift/secret.yaml` and replace `your_base64_encoded_api_key_here` with your encoded key
4. Apply the secret:
   ```bash
   oc apply -f .openshift/secret.yaml
   ```

### Step 4: Build and Deploy

#### Option A: Using S2I (Source-to-Image)

```bash
oc new-app nodejs~https://github.com/krissi2023/krissi-pimpin-pimpire.git
oc expose svc/krissi-pimpin-pimpire
```

#### Option B: Using Dockerfile

```bash
# Build the image
oc new-build --binary --name=krissi-pimpin-pimpire
oc start-build krissi-pimpin-pimpire --from-dir=. --follow

# Deploy using our configuration
oc apply -f .openshift/deployment.yaml
```

### Step 5: Verify Deployment

```bash
# Check deployment status
oc get pods
oc get routes

# Get the application URL
oc get route krissi-pimpin-pimpire-route -o jsonpath='{.spec.host}'
```

## API Endpoints

Once deployed, your application will have the following endpoints:

### Main Endpoints
- `GET /` - Application info
- `GET /api/games` - Available games list

### Gemini AI Endpoints
- `GET /api/gemini/status` - Check AI service status
- `POST /api/gemini/generate` - Generate AI content
- `POST /api/gemini/chat` - AI chat interaction

### Game Endpoints
- `POST /api/games/slots/init` - Initialize slot game
- `POST /api/games/slots/{gameId}/spin` - Spin slots
- `POST /api/games/rps/init` - Initialize Rock Paper Scissors
- `POST /api/games/rps/{gameId}/play` - Play RPS
- `POST /api/games/poker/init` - Initialize Texas Hold'em
- `POST /api/games/blackjack/init` - Initialize Blackjack

## Testing Your Deployment

```bash
# Test basic connectivity
curl https://your-app-url/

# Test Gemini status
curl https://your-app-url/api/gemini/status

# Test game initialization
curl -X POST https://your-app-url/api/games/slots/init

# Test Rock Paper Scissors
curl -X POST https://your-app-url/api/games/rps/init
curl -X POST https://your-app-url/api/games/rps/{gameId}/play \
  -H "Content-Type: application/json" \
  -d '{"choice": "rock"}'
```

## Troubleshooting

### Common Issues

1. **Pod not starting**: Check logs with `oc logs pod-name`
2. **Route not accessible**: Verify route with `oc get routes`
3. **Gemini API errors**: Check if secret is properly configured

### Useful Commands

```bash
# View application logs
oc logs -f deployment/krissi-pimpin-pimpire

# Describe deployment
oc describe deployment krissi-pimpin-pimpire

# Scale application
oc scale deployment krissi-pimpin-pimpire --replicas=2

# Delete and redeploy
oc delete -f .openshift/deployment.yaml
oc apply -f .openshift/deployment.yaml
```

## Environment Variables

The application supports the following environment variables:

- `NODE_ENV`: Set to 'production' for production deployment
- `GEMINI_API_KEY`: Your Google Gemini API key (set via secret)
- `PORT`: Application port (default: 3000)

## Security Considerations

1. **Never commit API keys**: Use OpenShift secrets for sensitive data
2. **HTTPS**: The route configuration enables TLS termination
3. **Resource limits**: Configured to prevent resource exhaustion
4. **Health checks**: Liveness and readiness probes are configured

## Updates and Maintenance

To update your application:

1. Update your code and push to Git
2. Rebuild the image: `oc start-build krissi-pimpin-pimpire`
3. The deployment will automatically update

For configuration changes:
1. Update the YAML files
2. Apply changes: `oc apply -f .openshift/deployment.yaml`

## Support

For issues with:
- **Red Hat Sandbox**: Check the Red Hat Developer documentation
- **This application**: Check the GitHub repository or create an issue
- **OpenShift**: Refer to the OpenShift documentation