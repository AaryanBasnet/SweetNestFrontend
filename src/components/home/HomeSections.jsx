import SeasonalCollection from "./SeasonalCollection";
import FeaturesGrid from "./FeaturesGrid";
import CrowdFavorites from "./CrowdFavorites";
import OurPhilosophy from "./OurPhilosophy";

/**
 * Everything on the home page below the hero. Home loads this separately, so a
 * visitor's phone can paint the hero before it has downloaded and run the code
 * for these four sections.
 */
export default function HomeSections() {
  return (
    <>
      {/* Seasonal Collection Section */}
      <SeasonalCollection />

      {/* Features Grid Section */}
      <FeaturesGrid />

      {/* Crowd Favorites Section */}
      <CrowdFavorites />

      {/* Our Philosophy Section */}
      <OurPhilosophy />
    </>
  );
}
