import {IRequest} from "./IRequest";

export class LoginOrRegistrationRequest implements IRequest {
    constructor(public email: string, public password: string) {
        this.email = email;
        this.password = password;
    }

    validate(): boolean {
        return !!(this.email && this.password &&
            this.email !== "" && this.password !== "");
    }
}