import React from 'react';
import marked from 'marked';

/**
 * Renderer
 */

function Renderer(options) {
	this.options = options || {};
}

Renderer.prototype = Object.assign({}, marked.Renderer.prototype);

Renderer.prototype.reduce = function(lhs, rhs){
	if(!lhs)
		return [];
	lhs.push(rhs);
	return lhs;
}

Renderer.prototype.code = function(code, lang, escaped) {
	if (this.options.highlight) {
		var out = this.options.highlight(code, lang);
		if (out != null && out !== code) {
			escaped = true;
			code = out;
		}
	}

	var codeClassName;
	if(lang){
		codeClassName = this.options.langPrefix + this.escape(lang, true);
	}

	return (
		<pre>
			<code className={codeClassName}>
				{escaped ? code : this.escape(code, true)}
			</code>
		</pre>
	)
}

Renderer.prototype.blockquote = function(quote) {
	return <blockquote>{quote}</blockquote>
}

Renderer.prototype.html = function(html) {
	return <div dangerouslySetInnerHTML={{__html: html}} />;
}

Renderer.prototype.heading = function(text, level, raw) {
	var heading = `h${level}`;
	var id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
	return React.createElement(heading, {id}, text);
}

Renderer.prototype.hr = function() {
  return <hr />
};

Renderer.prototype.list = function(body, ordered) {
  if(ordered){
     return <ol>{body}</ol>
  }
  else{
     return <ul>{body}</ul>	
  }
};

Renderer.prototype.listitem = function(text) {
  return <li>{text}</li>;
};

Renderer.prototype.paragraph = function(text) {
  return <p>{text}</p>;
};

Renderer.prototype.table = function(header, body) {
	return (
		<table>
			<thead>{header}</thead>
			<tbody>{body}</tbody>
		</table>
	)
}

Renderer.prototype.tablerow = function(content) {
	return <tr>{content}</tr>
}

Renderer.prototype.tablecell = function(content, flags) {
	var type = flags.header ? 'th' : 'td';
	var style;
	if(flags.align){
		style = {'text-align': flags.align}
	}

	return <type style={style}>{content}</type>
}

// span level renderer
Renderer.prototype.strong = function(text) {
  return <strong>{text}</strong>;
};

Renderer.prototype.em = function(text) {
  return <em>{text}</em>;
};

Renderer.prototype.codespan = function(text) {
  return <code>{text}</code>;
};

Renderer.prototype.br = function() {
  return <br/>;
};

Renderer.prototype.del = function(text) {
  return <del>{text}</del>;
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return;
    }
  }

  var twittermatch = /https:\/\/twitter\.com\/[a-z_\-0-9A-Z]+\/status\/(\d+)/.exec(href);
  if(twittermatch && this.twitter){
  	return this.twitter(href, twittermatch[1]);
  }
  else{
  	return <a href={href} title={title}>{text}</a>
  }

};

Renderer.prototype.image = function(href, title, text) {
  return <img src={href} alt={text} title={title}></img>;
};

Renderer.prototype.text = function(text) {
  return text;
};


module.exports = Renderer
