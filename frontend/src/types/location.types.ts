// frontend/src/types/location.types.ts

export interface Province {
    name: string;
    code: number; 
    division_type: string; // ví dụ: "thành phố trung ương", "tỉnh"
    codename: string;
    phone_code: number;
    districts: []; 
}

