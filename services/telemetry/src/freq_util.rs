pub fn display_freq(freq: f64) -> String {
    let mut freq = freq;
    let mut suffix = "Hz";

    if freq >= 1e9 {
        freq /= 1e9;
        suffix = "GHz";
    } else if freq >= 1e6 {
        freq /= 1e6;
        suffix = "MHz";
    } else if freq >= 1e3 {
        freq /= 1e3;
        suffix = "kHz";
    }

    format!("{:.3} {}", freq, suffix)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_display_freq_hz() {
        assert_eq!(display_freq(1.0), "1.000 Hz");
    }

    #[test]
    fn test_display_freq_khz() {
        assert_eq!(display_freq(1.0e3), "1.000 kHz");
        assert_eq!(display_freq(23.3425e3), "23.343 kHz");
    }

    #[test]
    fn test_display_freq_mhz() {
        assert_eq!(display_freq(1.0e6), "1.000 MHz");
        assert_eq!(display_freq(23.3425e6), "23.343 MHz");
    }

    #[test]
    fn test_display_freq_ghz() {
        assert_eq!(display_freq(1.0e9), "1.000 GHz");
        assert_eq!(display_freq(23.3425e9), "23.343 GHz");
    }
}
