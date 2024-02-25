export type InfoPayload = {
  endpointId: string,
  info: string
}

export type ConnectionInfoType = {
  endpointId: string,
  endpointName: string,
  authenticationToken: string,
  isIncomingConnection: boolean
}

export type PayloadUpdateType = {
  endpointId: string,
  status: number
}

export type PayloadType = {
  endpointId: string,
  message: string
}

export type ConnectionResolutionType = {
  endpointId: string,
  status: number
}

export type DiscoveredEndpointType = {
  endpointId: string,
  serviceId: string,
  endpointName: string
}

export type DisconnectionType = {
  endpointId: string
}