const FtN = (function() {

const init = function() {
    document.querySelector('#fastafile').addEventListener('change',fileSelect);
}

const fileSelect = function(e) {
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.onload = fileConvert;
    reader.readAsText(f);
}

const fileConvert = function(e) {
    const txt = e.target.result;
    const arr = txt.split(/\n/).map(s => s.trim());
    const sequences = new Map();
    var curname;
    var curseq = '';
    for(const line of arr) {
        if(line === '') continue;
        if(line[0] === '>') {
            if(curseq !== '') {
                sequences.set(curname,curseq);
                curseq = '';
            }
            curname = line.slice(1).trim();
        }
        else {
            curseq += line.trim();
        }
    }
    if(curseq !== '') {
        sequences.set(curname,curseq);
    }
    const taxa = [...sequences.keys()];
    const nchar = curseq.length;
    var output =
`#NEXUS

BEGIN TAXA;
    DIMENSIONS ntax=${taxa.length};
    TAXLABELS  ${taxa.map(s => "'"+s+"'").join(' ')};
END;

BEGIN CHARACTERS;
    DIMENSIONS nchar=${nchar};
    FORMAT DATATYPE = STANDARD GAP = - MISSING = ? SYMBOLS = "  0 1 2 3 4 5 6 7 8 9 A B C D E F G H J K M N P Q R S T U V W X Y Z a b c d e f g h j k m n p q r s t u v w x y z";
    MATRIX
`
    for(const key of taxa) {
        output += "    '"+key+"' ";
        output += sequences.get(key);
        output += "\n";
    }
    output += "END;";
    const outbox = document.querySelector('#output');
    outbox.innerHTML = '';
    outbox.appendChild(document.createTextNode(output));
};

return {
    init: init,
}
})();
window.addEventListener('load',FtN.init);
