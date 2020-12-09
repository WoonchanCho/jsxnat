import { DOMImplementation, XMLSerializer } from 'xmldom';
import debug from 'debug';
import { APP_NAME } from './Constant';

const log = debug(`${APP_NAME}:XmlParser`);

class XmlParser {
  __addChildNode(doc, parent, key, value) {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          this.__addChildNode(doc, parent, key, item);
        });
      } else {
        const node = doc.createElement(key);
        parent.appendChild(node);
        Object.keys(value).forEach((key) => {
          this.__addChildNodeOrAttribute(doc, node, key, value[key]);
        });
      }
    } else {
      const node = doc.createElement(key);
      parent.appendChild(node);
      node.appendChild(doc.createTextNode(value));
    }
  }

  __addAttribute(parent, attrs) {
    Object.keys(attrs).forEach((key) => {
      parent.setAttribute(key, attrs[key]);
    });
  }

  __addChildNodeOrAttribute(doc, parent, key, value) {
    if (key === '_attrs') {
      this.__addAttribute(parent, value);
    } else {
      this.__addChildNode(doc, parent, key, value);
    }
  }

  convertFromJsonToXml(rootElementName, json) {
    const doc = new DOMImplementation().createDocument(
      null,
      rootElementName,
      null
    );
    doc.documentElement.setAttribute(
      'xmlns:xsi',
      'http://www.w3.org/2001/XMLSchema-instance'
    );

    Object.keys(json).forEach((key) => {
      this.__addChildNodeOrAttribute(doc, doc.documentElement, key, json[key]);
    });

    const xmlString = new XMLSerializer().serializeToString(doc);
    log(xmlString);
    return xmlString;
  }
}

export default XmlParser;
