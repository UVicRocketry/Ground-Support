import time
import random

def float_to_formatted_string(number):
    num_str = f"{number:.2f}"
    int_part, decimal_part = num_str.split('.')
    
    if len(int_part) > 2:
        formatted_int_part = int_part[:-2] + ' ' + int_part[-2:]
    else:
        formatted_int_part = int_part
    
    formatted_number = formatted_int_part + '.' + decimal_part
    
    return formatted_number

while True:
    lat_north = random.random() * 10000
    lat_west = random.random() * 100000
    altitude = int(round(random.random() * 10000))
    audio_level = 38 - int(round(random.random() * 4))
    num_satellites_locked = 3 + int(round(random.random() * 3))
    num_satellites_total = num_satellites_locked + int(round(random.random() * 2))
    print("VA7JCK-1 audio level = {:2d}({:1d}/{:1d})    [NONE]   |||||||__".format(audio_level, num_satellites_locked, num_satellites_total))
    print("[0.3] VA7JCK-1>APBL10:!{:.2f}N/{:.2f}W-/A={:06d}*".format(lat_north, lat_west, altitude))
    print("Position, House QTH (VHF)")
    print("N {}, W {}, alt {:.0f} ft".format(float_to_formatted_string(lat_north), float_to_formatted_string(lat_west), altitude))
    print("*")
    print()
    time.sleep(3)