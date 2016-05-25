import assert from "../src/core/assert";
import * as groups from "./groups";

import tochars from "../src/data/tochars";
import tobytes from "../src/data/tobytes";
import Base16  from "../src/data/codec/Base16";
import MD4     from "../src/data/crypto/MD4";

const filedesc = "MD4 Test Suite";
groups.start(filedesc);
// MD4 test suite:
// MD4 ("") = 31d6cfe0d16ae931b73c59d7e0c089c0
// MD4 ("a") = bde52cb31de33e46245e05fbdbd6fb24
// MD4 ("abc") = a448017aaf21d8525fc10ae87aa6729d
// MD4 ("message digest") = d9130a8164549fe818874806e1c7014b
// MD4 ("abcdefghijklmnopqrstuvwxyz") = d79e1c308aa5bbcdeea8ed63df412da9
// MD4 ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =
// 043f8582f241db351ce627e153e7f0e4
// MD4 ("12345678901234567890123456789012345678901234567890123456789012345678901234567890") = e33b4ddc9c38f2199c3e7b164fcc0536

function test_md4( input, expect ) {
    var result = tochars((new Base16()).encode((new MD4()).update(tobytes(input,1)).digest()));
    assert( result === expect, `MD4 hash does not match. \n{\n    expect: "${expect}", \n    result: "${result}", \n    input : "${input}"\n}` );
}

test_md4("", "31d6cfe0d16ae931b73c59d7e0c089c0");
test_md4("a", "bde52cb31de33e46245e05fbdbd6fb24");
test_md4("abc", "a448017aaf21d8525fc10ae87aa6729d");
test_md4("message digest", "d9130a8164549fe818874806e1c7014b");
test_md4("abcdefghijklmnopqrstuvwxyz", "d79e1c308aa5bbcdeea8ed63df412da9");
test_md4("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "043f8582f241db351ce627e153e7f0e4");
test_md4("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "e33b4ddc9c38f2199c3e7b164fcc0536");

groups.end(filedesc);