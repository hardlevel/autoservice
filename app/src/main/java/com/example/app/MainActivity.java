public class MainActivity extends AppCompatActivity {
    private Cue2Pops cue2pops = new Cue2Pops();

    public void convertFile(String inputPath, String outputPath) {
        int result = cue2pops.convertCueToVcd(
            inputPath,
            outputPath,
            true,  // vmode
            false, // trainer
            false, // gap++
            false  // gap--
        );

        if (result == 0) {
            // Conversion successful
        }
    }
}