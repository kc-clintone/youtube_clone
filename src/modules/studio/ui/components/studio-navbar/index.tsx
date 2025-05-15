import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import Link from "next/link";
import Image from "next/image";
import { StudioUploadModal } from "../studio-upload-modal";

export const StudioNavbar = () => {
  return (
    <nav className="top-0 left-0 right-0 h-16 fixed flex bg-white items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="w-full gap-4 flex items-center">
        {/**menu and sidebar**/}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger/>
          <Link href="/studio">
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo.png" height={50} width={50} alt="logo" />
              <p className="font-semibold text-xl tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        {/**spacer**/}
        <div className="flex-1"/>

        {/**Auth and Create button**/}
        <div className="flex flex-shrink-0 items-center gap-4">
          <StudioUploadModal/>
          <AuthButton/>
        </div>
      </div>
    </nav>
  )
}
