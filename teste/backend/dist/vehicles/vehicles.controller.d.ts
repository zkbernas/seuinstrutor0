import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(dto: CreateVehicleDto): Promise<{
        id: string;
        year: number;
        model: string;
        brand: string;
        plate: string;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        isAdapted: boolean;
        instructorId: string;
    }>;
    findAll(): Promise<({
        instructor: {
            user: {
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
            credenicalNumber: string;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
        };
    } & {
        id: string;
        year: number;
        model: string;
        brand: string;
        plate: string;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        isAdapted: boolean;
        instructorId: string;
    })[]>;
    findOne(id: string): Promise<({
        instructor: {
            id: string;
            userId: string;
            cpf: string;
            phone: string;
            credenicalNumber: string;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
        };
    } & {
        id: string;
        year: number;
        model: string;
        brand: string;
        plate: string;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        isAdapted: boolean;
        instructorId: string;
    }) | null>;
    update(id: string, dto: UpdateVehicleDto): Promise<{
        id: string;
        year: number;
        model: string;
        brand: string;
        plate: string;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        isAdapted: boolean;
        instructorId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        year: number;
        model: string;
        brand: string;
        plate: string;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        isAdapted: boolean;
        instructorId: string;
    }>;
}
