<template>
  <div>
    <v-breadcrumbs :items="crumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
    import LocationService from '../services/locationService';
    export default {
        computed: {
            crumbs: function() {
                const service = new LocationService();

                let pathArray = this.$route.path.split("/")
                pathArray.shift()
                const tempArr = []
                // join the path together
                if (pathArray.length > 1) {
                    let i = 0
                    while (i < pathArray.length) {
                        tempArr.push(pathArray[i] + '/' + pathArray[i+1])
                        i+=2;
                    }
                }
                pathArray = tempArr

                // create breadcrumbs
                const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
                    let name = "";
                    const params = this.$route.params;
                    if (path.includes('location')) {
                        name = service.getLocationbyId(params['locationId']);
                    } 

                    if (path.includes('room')) {
                        name = service.getRoomById(params['roomId']);
                    }

                    breadcrumbArray.push({
                        path: path,
                        to: breadcrumbArray[idx - 1]
                        ? "/" + breadcrumbArray[idx - 1].path + "/" + path
                        : "/" + path,
                        text: name,
                        exact: true
                    });
                    return breadcrumbArray;
                }, [])

                breadcrumbs.unshift({
                    path: 'home',
                    to: '/home',
                    text: "Home"
                });

                console.log(breadcrumbs);

                return breadcrumbs;
            }
        }
    };
</script>