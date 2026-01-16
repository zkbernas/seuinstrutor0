export declare enum UserRole {
    ADMIN = "ADMIN",
    INSTRUCTOR = "INSTRUCTOR",
    STUDENT = "STUDENT"
}
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}
