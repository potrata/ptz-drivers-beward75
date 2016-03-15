# PTZ Driver for Beward-75

### Current Version
0.1.2

### Installation

Drivers are downloaded and installed automagically by worker's special subroutines, responsible to keep drivers up to date with central registry. So, driver's registration is getting done easily by sending following request to Driver's Registry API endpoint:

```
POST / HTTP/1.1
Host: <Your_API_Endpoint>
Content-Type: application/json
Cache-Control: no-cache
{
    "id": "beward_75",
    "model": "beward_75",
    "packageUrl": "@hp/ptz-drivers-beward75",
    "version": "latest"
}
```


### List of currently ready and supported actions
    - setPosition
    - getPosition
    - changePosition
    - changePositionZoomed
    - setSpeed
    - changeFocus
