import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate {
    // Must return a boolean value
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        return request?.currentUser
    }
}