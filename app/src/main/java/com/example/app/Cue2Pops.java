package com.example.app;

public class Cue2Pops {
    static {
        System.loadLibrary("cue2pops");
    }

    public native int convertCueToVcd(
        String inputCuePath,
        String outputVcdPath,
        boolean vmode,
        boolean trainer,
        boolean gapMore,
        boolean gapLess
    );
}
