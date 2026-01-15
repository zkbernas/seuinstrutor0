export declare class CreateVehicleDto {
    model: string;
    brand: string;
    year: number;
    plate: string;
    transmission: 'MANUAL' | 'AUTOMATIC';
    isAdapted: boolean;
    instructorId: string;
}
