import assert from "../src/core/assert";
import * as groups from "./groups";

import tochars from "../src/data/tochars";
import tobytes from "../src/data/tobytes";
import Base16  from "../src/data/codec/Base16";
import MD2     from "../src/data/crypto/MD2";

const filedesc = "MD2 Test Suite";
groups.start(filedesc);
// MD2 test suite:
// MD2 ("") = 8350e5a3e24c153df2275c9f80692773
// MD2 ("a") = 32ec01ec4a6dac72c0ab96fb34c0b5d1
// MD2 ("abc") = da853b0d3f88d99b30283a69e6ded6bb
// MD2 ("message digest") = ab4f496bfb2a530b219ff33031fe06b0
// MD2 ("abcdefghijklmnopqrstuvwxyz") = 4e8ddff3650292ab5a4108c3aa47940b
// MD2 ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =
// da33def2a42df13975352846c30338cd
// MD2 ("123456789012345678901234567890123456789012345678901234567890123456
// 78901234567890") = d5976f79d83d3a0dc9806c3c66f3efd8

function test_md2( input, expect ) {
    var result = tochars((new Base16()).encode((new MD2()).update(tobytes(input,1)).digest()));
    console.log( result == expect, result, input );
    assert( result === expect, `MD2 hash does not match. \n{\n    expect: "${expect}", \n    result: "${result}", \n    input : "${input}"\n}` );
}

test_md2("", "8350e5a3e24c153df2275c9f80692773");
test_md2("a", "32ec01ec4a6dac72c0ab96fb34c0b5d1");
test_md2("abc", "da853b0d3f88d99b30283a69e6ded6bb");
test_md2("message digest", "ab4f496bfb2a530b219ff33031fe06b0");
test_md2("abcdefghijklmnopqrstuvwxyz", "4e8ddff3650292ab5a4108c3aa47940b");
test_md2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "da33def2a42df13975352846c30338cd");
test_md2("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "d5976f79d83d3a0dc9806c3c66f3efd8");

groups.end(filedesc);