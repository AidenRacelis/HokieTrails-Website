import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";
import { NavBar } from "@/components/menu-bar";

export default function Home() {
  return (
    <main>
      <NavBar>
      </NavBar>

      <MapProvider>
        <MapComponent>
        </MapComponent>
      </MapProvider>

      


    </main>
   


  );
}
