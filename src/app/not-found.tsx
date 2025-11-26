"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex items-center flex-col justify-center text-4xl min-h-screen">
      <Image className=" size-80" src="/svg/404.svg" alt="not found" />
      <Button onClick={() => router.back()}>Go Previous Page</Button>
    </div>
  );
};

export default NotFound;
