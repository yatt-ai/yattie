/*
 * Return the HTML representation of a node.
 * The node is an object that has text, url, and category attributes
 * all of them optional.
 */
export default (node) => {
  return `
  <div
    tabindex="0"
    class="node-body v-card v-card--link v-sheet theme--light"
    style="border: 3px solid green"
  >
    <div class="v-card__actions" style="marginRight: 20px">
      <div class="spacer"></div>
      <button
        type="button"
        class="v-btn v-btn--icon v-btn--round theme--light v-size--default"
        style="color: rgb(107, 114, 128); caret-color: rgb(107, 114, 128)"
      >
        <span class="v-btn__content"
          ><i class="fas fa-plus-circle"></i
        ></span></button
      ><button
        type="button"
        class="v-btn v-btn--icon v-btn--round theme--light v-size--default"
        style="color: rgb(107, 114, 128); caret-color: rgb(107, 114, 128)"
      >
        <span class="v-btn__content"
          ><i class="fas fa-trash-alt"></i
        ></span></button
      ><button
        type="button"
        class="v-btn v-btn--icon v-btn--round theme--light v-size--default"
        style="color: rgb(107, 114, 128); caret-color: rgb(107, 114, 128)"
      >
        <span class="v-btn__content"
          ><i class="fas fa-file-lines"></i></label
          ></span></button
      ><button
        type="button"
        class="v-btn v-btn--icon v-btn--round theme--light v-size--default"
        style="color: rgb(107, 114, 128); caret-color: rgb(107, 114, 128)"
      >
        <span class="v-btn__content"><i class="fas fa-link"></i></span>
      </button>
    </div>
    <hr
      role="separator"
      aria-orientation="horizontal"
      class="v-divider theme--light"
    />
    <div class="node-content">${node.text}</div>
    <div class="node-tags">
      <div data-v-61d92e31="" class="vue-tags-input">
        <div data-v-61d92e31="" class="ti-input">
          <ul data-v-61d92e31="" class="ti-tags">
            <li data-v-61d92e31="" class="ti-new-tag-input-wrapper">
              <input
                data-v-61d92e31=""
                placeholder="Add Tag"
                type="text"
                size="1"
                class="ti-new-tag-input ti-valid"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
};

/*
 * Return the HTML representation of a node.
 * The node is an object that has text, url, and category attributes
 * all of them optional.
 */
export const subnodesToHtml = (subnodes = [], fcolor) => {
  let color = fcolor || "";

  if (!fcolor && subnodes.length > 0 && subnodes[0].color) {
    color = `style="border-left-color: ${subnodes[0].color}"`;
  }

  return subnodes
    .map((subnode) => {
      let href = `href="${subnode.url}"`;

      if (!subnode.url) {
        href = "";
      }

      return `<div class="mindmap-subnode-group" ${color}>
                  <a ${href}>${subnode.text || ""}</a>
                  <div>${subnodesToHtml(subnode.nodes, color)}</div>
                </div>`;
    })
    .join("");
};
