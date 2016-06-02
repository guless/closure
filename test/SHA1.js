import assert from "../src/core/assert";
import * as groups from "./groups";

import tochars from "../src/data/tochars";
import tobytes from "../src/data/tobytes";
import Base16  from "../src/data/codec/Base16";
import SHA1    from "../src/data/crypto/SHA1";

const filedesc = "SHA1 Test Suite";
groups.start(filedesc);

function test_sha1( input, expect ) {
    var result = tochars((new Base16()).encode((new SHA1()).update(tobytes(input,1)).digest()));
    
    console.log( result == expect, result, input );
    assert( result === expect, `SHA1 hash does not match. \n{\n    expect: "${expect}", \n    result: "${result}", \n    input : "${input}"\n}` );
}

test_sha1("", "da39a3ee5e6b4b0d3255bfef95601890afd80709");
test_sha1("a", "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8");
test_sha1("abc", "a9993e364706816aba3e25717850c26c9cd0d89d");
test_sha1("Secure Hash Algorithm", "d3517cbe39e304a3988dc773fa6f1e71f6ff965e");
test_sha1("abcdefghijklmnopqrstuvwxyz", "32d10c7b8cf96570ca04ce37f2a19d84240d3a89");
test_sha1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "761c457bf73b14d27e9e9265c46f4b4dda11f940");
test_sha1("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "50abf5706a150990a08b2c5ea40fa0e585554732");

groups.end(filedesc);