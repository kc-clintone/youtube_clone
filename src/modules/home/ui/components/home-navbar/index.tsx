import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import { SearchInput } from "./search-input"
import Link from "next/link";
import Image from "next/image";
// import { StudioUploadModal } from "@/modules/studio/ui/components/studio-upload-modal";

export const HomeNavbar = () => {
  return (
    <nav className="top-0 left-0 right-0 h-16 fixed flex bg-white items-center px-2 pr-5 z-50">
      <div className="w-full gap-4 flex items-center">
        {/**menu and sidebar**/}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger/>
          <Link href="/">
            <div className="flex items-center p-4">
              <Image src="/logo.png" height={50} width={50} alt="logo" />
              <p className="font-semibold text-xl tracking-tight">xtremeArt</p>
            </div>
          </Link>
        </div>

        {/**searchbar**/}
        <div className="flex-1 flex justify-center mx-auto max-w-[720px]">
          <SearchInput/>
        </div>

        {/**Auth button**/}
        <div className="flex flex-shrink-0 items-center gap-4">
          {/* <StudioUploadModal/> */}
          <AuthButton/>
        </div>
      </div>
    </nav>
  )
}
