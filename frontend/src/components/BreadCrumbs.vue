<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
import dbService from "../services/dbService";

export default {
  data() {
    return {
      breadcrumbs: [],
    };
  },
  mounted: function() {
    const service = new dbService();

    // Example route: localhost:8080/location/K-F8/room/101
    const urlWords = this.$route.path.split("/");

    // Get rid of first term which is always ""
    urlWords.shift();

    // Separate path into its different components
    // i.e. the building (location/1) and room (room/101)
    const paths = [];
    for (let i = 0; i < urlWords.length; i += 2) {
      paths.push(urlWords.slice(i, i + 2));
    }

    const params = this.$route.params;
    service.getBuildingByLocation(params["locationId"]).then((res) => {
      // Create breadcrumbs
      let name = "";
      for (const path of paths) {
        if (path.includes("location")) {
          name = res;
        } else if (path.includes("room")) {
          name = params["roomId"];
        }

        this.breadcrumbs.push({
          to: "/" + path,
          text: name,
          exact: true, // Ensure it is a link
        });
      }

      // Add root
      this.breadcrumbs.unshift({
        to: "/",
        text: "Home",
        exact: true,
      });
    });
  },
};
</script>
