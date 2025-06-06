export interface Client {
  id: number;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string; 
  updatedAt: string;
  allocations?: ClientAsset[]; 
}

export interface Asset {
  id: number;
  name: string;
  value: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface ClientAsset {
  id: number;
  clientId: number;
  assetId: number;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  asset: {
    id: number;
    name: string;
    value: string;
    createdAt: string;
    updatedAt: string;
  };
}
