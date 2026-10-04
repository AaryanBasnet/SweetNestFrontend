import { useEffect } from "react";

const SITE_NAME = "SweetNest";
const HOME_TITLE = `${SITE_NAME} | Handmade Cakes, Designed by You`;

export const formatPageTitle = (title) =>
  title ? `${title} | ${SITE_NAME}` : HOME_TITLE;

/** Sets the browser tab title; pass nothing for the home page title. */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = formatPageTitle(title);
  }, [title]);
}
