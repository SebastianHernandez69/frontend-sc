import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Landing
      <Link className={buttonVariants()} href={"/home"}>Home</Link>
    </div>
  );
}
