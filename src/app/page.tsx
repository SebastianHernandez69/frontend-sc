import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Landing
      <Link className={buttonVariants()} href={"/home"}>Home</Link>
      <Link className={buttonVariants()} href={"/profile"}>Login</Link>
      <Link className={buttonVariants()} href={"/auth/register"}>Register</Link>
    </div>
  );
}
