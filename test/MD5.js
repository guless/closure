import assert from "../src/core/assert";
import * as groups from "./groups";

import tochars from "../src/data/tochars";
import tobytes from "../src/data/tobytes";
import Base16  from "../src/data/codec/Base16";
import MD5     from "../src/data/crypto/MD5";

const filedesc = "MD5 Test Suite";
groups.start(filedesc);
// MD5 test suite:
// MD5 ("") = d41d8cd98f00b204e9800998ecf8427e
// MD5 ("a") = 0cc175b9c0f1b6a831c399e269772661
// MD5 ("abc") = 900150983cd24fb0d6963f7d28e17f72
// MD5 ("message digest") = f96b697d7cb7938d525a2f31aaf161d0
// MD5 ("abcdefghijklmnopqrstuvwxyz") = c3fcd3d76192e4007dfb496cca67e13b
// MD5 ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") = d174ab98d277d9f5a5611c2c9f419d9f
// MD5 ("12345678901234567890123456789012345678901234567890123456789012345678901234567890") = 57edf4a22be3c955ac49da2e2107b67a

function test_md5( input, expect ) {
    var result = tochars((new Base16()).encode((new MD5()).update(tobytes(input,1)).digest()));
    console.log( result == expect, result, input );
    assert( result === expect, `MD5 hash does not match. \n{\n    expect: "${expect}", \n    result: "${result}", \n    input : "${input}"\n}` );
}

test_md5("", "d41d8cd98f00b204e9800998ecf8427e");
test_md5("a", "0cc175b9c0f1b6a831c399e269772661");
test_md5("abc", "900150983cd24fb0d6963f7d28e17f72");
test_md5("message digest", "f96b697d7cb7938d525a2f31aaf161d0");
test_md5("abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b");
test_md5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d174ab98d277d9f5a5611c2c9f419d9f");
test_md5("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "57edf4a22be3c955ac49da2e2107b67a");

groups.end(filedesc);