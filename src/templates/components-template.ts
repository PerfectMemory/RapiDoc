import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { schemaInObjectNotation } from '@rapidoc/utils/schema-utils';
import '@rapidoc/components/json-tree';
import '@rapidoc/components/schema-tree';
import '@rapidoc/components/schema-table';
import { RapidocElement, RapiDocSchema } from '@rapidoc-types';

function schemaBodyTemplate(this: RapidocElement, sComponent: { name: string; id: string; component: RapiDocSchema}) {
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${sComponent.name}' id='cmp--${sComponent.id}' >
    <div style="font-weight:bold"> ${sComponent.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400;"> Schema </span></div>
  ${this.schemaStyle === 'table'
    ? html`
      <schema-table
        .data = '${schemaInObjectNotation(sComponent.component, {})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-table>`
    : html`
      <schema-tree
        .data = '${schemaInObjectNotation(sComponent.component, {})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-tree>`
}
  </div>`;
}

function componentBodyTemplate(this: RapidocElement, sComponent: { name: string; id: string; component: RapiDocSchema}, componentType: string) {
  if (sComponent.id.indexOf('schemas-') !== -1) {
    return schemaBodyTemplate.call(this, sComponent);
  }
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${sComponent.name}' id='cmp--${sComponent.id}' >
    ${html`
      <div style="font-weight:bold"> ${sComponent.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400"> ${componentType} </span> </div>
      ${sComponent.component
    ? html`
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg2)'> 
        <json-tree class="border tree" render-style='${this.renderStyle}' .data="${sComponent.component}"> </json-tree>
      </div>`
    : ''}
    `}
  </div>
  `;
}

export default function componentsTemplate(this: RapidocElement) {
  if (!this.resolvedSpec) { return ''; }
  // TODO: Typescript migration, replace any by proper typing, resolvedSpec.components should not be an array
  return html`
  ${(this.resolvedSpec.components as any)?.map((component: any) => html`
    <div id="cmp--${component.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${component.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(component.description ? component.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${component.subComponents.filter((c: any) => c.expanded !== false).map((sComponent: any) => componentBodyTemplate.call(this, sComponent, component.name))}
    </div>
    `)
}
`;
}
/* eslint-enable indent */