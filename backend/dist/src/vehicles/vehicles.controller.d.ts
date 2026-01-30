import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(dto: CreateVehicleDto): Promise<{
        id: string;
        year: number;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        model: string;
        brand: string;
        plate: string;
        isAdapted: boolean;
        instructorId: string;
    }>;
    findAll(): Promise<({
        instructor: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string;
            phone: string;
            credentialNumber: string;
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
            rejectionReason: string | null;
            rejectionNotes: string | null;
        };
    } & {
        id: string;
        year: number;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        model: string;
        brand: string;
        plate: string;
        isAdapted: boolean;
        instructorId: string;
    })[]>;
    findOne(id: string): Promise<({
        instructor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cpf: string;
            phone: string;
            credentialNumber: string;
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            address: string | null;
            pricePerHour: import("@prisma/client/runtime/library").Decimal;
            categories: string[];
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
            rejectionReason: string | null;
            rejectionNotes: string | null;
        };
    } & {
        id: string;
        year: number;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        model: string;
        brand: string;
        plate: string;
        isAdapted: boolean;
        instructorId: string;
    }) | null>;
    update(id: string, dto: UpdateVehicleDto): Promise<{
        id: string;
        year: number;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        model: string;
        brand: string;
        plate: string;
        isAdapted: boolean;
        instructorId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        year: number;
        transmission: import("@prisma/client").$Enums.TransmissionType;
        model: string;
        brand: string;
        plate: string;
        isAdapted: boolean;
        instructorId: string;
    }>;
}
