from yolobit import *
button_a.on_pressed = None
button_b.on_pressed = None
button_a.on_pressed_ab = button_b.on_pressed_ab = -1
from mqtt import *
from machine import RTC
import ntptime
import time
from homebit3_lcd1602 import LCD1602
from event_manager import *
from machine import Pin, SoftI2C
from homebit3_dht20 import DHT20

lcd1602 = LCD1602()

event_manager.reset()

def on_event_timer_callback_A_B_p_u_j():
  global Chu_E1_BB_97i_AI, Th_E1_BB_9Di_Gian, th_C3_B4ng_tin, RT, L_E1_BB_87nh_AI, SM, RH, LUX
  Th_E1_BB_9Di_Gian = (int(('%0*d' % (2, RTC().datetime()[4])))) * 60
  Th_E1_BB_9Di_Gian = (Th_E1_BB_9Di_Gian if isinstance(Th_E1_BB_9Di_Gian, (int, float)) else 0) + (int(('%0*d' % (2, RTC().datetime()[5]))))
  if Th_E1_BB_9Di_Gian > 420:
    pin13.write_digital((1))
    mqtt.publish('V11', '1')
  if Th_E1_BB_9Di_Gian > 435:
    pin13.write_digital((0))
    mqtt.publish('V11', '0')
  if Th_E1_BB_9Di_Gian > 840:
    pin13.write_digital((1))
    mqtt.publish('V11', '1')
  if Th_E1_BB_9Di_Gian > 870:
    pin13.write_digital((0))
    mqtt.publish('V11', '0')

event_manager.add_timer_event(60000, on_event_timer_callback_A_B_p_u_j)

def on_event_timer_callback_a_y_g_W_o():
  global Chu_E1_BB_97i_AI, Th_E1_BB_9Di_Gian, th_C3_B4ng_tin, RT, L_E1_BB_87nh_AI, SM, RH, LUX
  if SM < 50:
    pin10.write_digital((1))
    mqtt.publish('V10', '1')
  if SM > 80:
    pin10.write_digital((0))
    mqtt.publish('V10', '0')

event_manager.add_timer_event(60000, on_event_timer_callback_a_y_g_W_o)

dht20 = DHT20()

def on_event_timer_callback_T_U_a_j_H():
  global Chu_E1_BB_97i_AI, Th_E1_BB_9Di_Gian, th_C3_B4ng_tin, RT, L_E1_BB_87nh_AI, SM, RH, LUX
  dht20.read_dht20()
  RT = dht20.dht20_temperature()
  RH = dht20.dht20_humidity()
  SM = translate((pin1.read_analog()), 0, 4096, 0, 100)
  LUX = pin2.read_analog()
  lcd1602.move_to(0, 0)
  lcd1602.putstr('RT:')
  lcd1602.move_to(3, 0)
  lcd1602.putstr(RT)
  lcd1602.move_to(7, 0)
  lcd1602.putstr('*C ')
  lcd1602.move_to(10, 0)
  lcd1602.putstr('RH:')
  lcd1602.move_to(13, 0)
  lcd1602.putstr(RH)
  lcd1602.move_to(15, 0)
  lcd1602.putstr('%')
  lcd1602.move_to(0, 1)
  lcd1602.putstr('LUX:')
  lcd1602.move_to(4, 1)
  lcd1602.putstr('      ')
  lcd1602.move_to(4, 1)
  lcd1602.putstr(LUX)
  lcd1602.move_to(10, 1)
  lcd1602.putstr('SM: ')
  lcd1602.move_to(13, 1)
  lcd1602.putstr(SM)
  lcd1602.move_to(15, 1)
  lcd1602.putstr('%')
  mqtt.publish('V1', RT)
  mqtt.publish('V2', RH)
  mqtt.publish('V3', SM)
  mqtt.publish('V4', LUX)

event_manager.add_timer_event(30000, on_event_timer_callback_T_U_a_j_H)

def on_event_timer_callback_D_z_g_o_J():
  global Chu_E1_BB_97i_AI, Th_E1_BB_9Di_Gian, th_C3_B4ng_tin, RT, L_E1_BB_87nh_AI, SM, RH, LUX
  Th_E1_BB_9Di_Gian = (int(('%0*d' % (2, RTC().datetime()[4])))) * 10
  Th_E1_BB_9Di_Gian = (Th_E1_BB_9Di_Gian if isinstance(Th_E1_BB_9Di_Gian, (int, float)) else 0) + (int(('%0*d' % (2, RTC().datetime()[5]))))
  if Th_E1_BB_9Di_Gian > 420:
    pin13.write_digital((1))
    mqtt.publish('V11', '1')
  if Th_E1_BB_9Di_Gian > 435:
    pin13.write_digital((0))
    mqtt.publish('V11', '0')
  if Th_E1_BB_9Di_Gian > 840:
    pin13.write_digital((1))
    mqtt.publish('V11', '1')
  if Th_E1_BB_9Di_Gian > 870:
    pin13.write_digital((0))
    mqtt.publish('V11', '0')

event_manager.add_timer_event(60000, on_event_timer_callback_D_z_g_o_J)

if True:
  display.scroll('YoLoFarm')
  mqtt.connect_wifi('ASUS', '201202c5')
  mqtt.connect_broker(server='mqtt.ohstem.vn', port=1883, username='LeHoang', password='')
  display.scroll('OK')
  ntptime.settime()
  (year, month, mday, week_of_year, hour, minute, second, milisecond) = RTC().datetime()
  RTC().init((year, month, mday, week_of_year, hour+7, minute, second, milisecond))
  lcd1602.clear()

while True:
  mqtt.check_message()
  event_manager.run()
  time.sleep_ms(1000)
  time.sleep_ms(10)