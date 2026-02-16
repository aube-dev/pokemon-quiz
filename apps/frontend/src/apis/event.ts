import { api } from "./base";
import { HttpMethod } from "@/constants/api";
import { queryKey } from "@/utils/api";

export interface EventConfigResponse {
    eventStartTime: string;
    eventEndTime: string;
}

export const eventQueryKey = queryKey("event");

export const api_getEventConfig = api.queryApi<null, EventConfigResponse>({
    method: HttpMethod.GET,
    endpoint: "/api/event/config",
    request: () => ({}),
    queryKey: () => eventQueryKey.add("config").value,
});
