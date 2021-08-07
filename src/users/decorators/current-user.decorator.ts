import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    // context: incoming request
    // data: variable to pass when using this decorator
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        return request.currentUser
    }
)