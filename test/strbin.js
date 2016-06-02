import assert from "../src/core/assert";
import * as groups from "./groups";

import strbin from "../src/data/strbin";
import * as PADCHAR from "../src/data/strbin";

const filedesc = "strbin Test Suite";
groups.start(filedesc);

function test( input, radix, padchar, expect ) {
    var result = strbin(input, radix, padchar);
    console.log( result == expect, result, input, radix, padchar );
    assert( result === expect, "strbin does not match. ");
}

test(0xFF, 16, PADCHAR.STRBIN_PAD2ZERO, "ff");
test(0xFF, 16, PADCHAR.STRBIN_PAD4ZERO, "00ff");
test(0xFF, 16, PADCHAR.STRBIN_PAD6ZERO, "0000ff");
test(0xFF, 16, PADCHAR.STRBIN_PAD8ZERO, "000000ff");

test(0xFF, 2, PADCHAR.STRBIN_PAD8ZERO, "11111111");
test(0xFF, 2, PADCHAR.STRBIN_PAD16ZERO, "0000000011111111");
test(0xFF, 2, PADCHAR.STRBIN_PAD32ZERO, "00000000000000000000000011111111");

test(0xFF, 16, PADCHAR.STRBIN_NO_PAD, "ff");
test(0xFF, 2, PADCHAR.STRBIN_NO_PAD, "11111111");
test(0xFF, undefined, undefined, "000000ff");

groups.end(filedesc);