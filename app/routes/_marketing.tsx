import { Outlet } from "@remix-run/react";

import MainHeader from "~/components/navigation/MainHeader";
import marketingStyles from "~/styles/marketing.css";
import type { LoaderArgs } from "@remix-run/node";
import { getUserFromSession } from "~/data/auth.server";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />;
    </>
  );
}

export function loader({ request }: LoaderArgs) {
  return getUserFromSession(request);
}

export function links() {
  return [{ rel: "stylesheet", href: marketingStyles }];
}

// 상위 헤더는 아래에서 무시된다.
export function headers() {
  return {
    // 실제 서비스에서는 캐시가 적용될 것이다. 개발환경에서는 적용안됨.
    "Cache-Control": "public, max-age=3600", // 1 hour
  };
}
