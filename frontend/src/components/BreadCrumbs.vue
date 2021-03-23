<template>
  <v-breadcrumbs :items="crumbs">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
import LocationService from "../services/locationService";
// have to do it like this without a class
// so we dont have to deal with lifecycle hoooks like mounted and
// we dont have to worry about $route being empty
export default {
  computed: {
    crumbs: function() {
      const service = new LocationService();

      // Example route: localhost:8080/location/1/room/Ainsworth%20101
      let pathArray = this.$route.path.split("/");
      pathArray.shift();

      // Separate path into its different components
      // i.e. the building (location/1) and room (room/Ainsworth%20101)
      const tempArr = [];
      if (pathArray.length > 1) {
        let i = 0;
        while (i < pathArray.length) {
          tempArr.push(pathArray[i] + "/" + pathArray[i + 1]);
          i += 2;
        }
      }
      pathArray = tempArr;

      // Create breadcrumbs
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        let name = "";

        const params = this.$route.params;
        if (path.includes("location")) {
          name = service.getBuildingByID(params["locationId"]);
        } else if (path.includes("room")) {
          name = params["roomId"];
        }

        breadcrumbArray.push({
          to: breadcrumbArray[idx - 1]
            ? breadcrumbArray[idx - 1].to + "/" + path // Append current room/building to previous path
            : "/" + path, // Is first element, just return /path
          text: name,
          exact: true, // Ensure it is a link
        });
        return breadcrumbArray;
      }, []);

      // Add root
      breadcrumbs.unshift({
        to: "/home",
        text: "Home",
        exact: true,
      });

      return breadcrumbs;
    },
  },
};
</script>
