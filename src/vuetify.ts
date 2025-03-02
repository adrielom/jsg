import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VTreeview } from "vuetify/labs/VTreeview";

const vuetify = createVuetify({
  components: {
    ...components,
    VTreeview,
  },
  directives,
});

export default vuetify;
