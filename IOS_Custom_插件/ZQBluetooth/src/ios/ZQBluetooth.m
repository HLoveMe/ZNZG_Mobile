//
//  ZGBluetooth.m
//  云上展馆
//
//  Created by space on 2017/11/14.
//

#import "ZQBluetooth.h"
#import <JoysuchSDK/JoysuchSDK.h>
#import <CoreLocation/CoreLocation.h>
@interface ZQBluetooth()<JSLocateManagerDelegate>
@property(nonatomic,copy)NSString *callID;
@property(nonatomic,assign)double angula;
@end
@implementation ZQBluetooth
-(void)pluginInitialize{
    JSLocateManager *manager = [JSLocateManager sharedDefaults];
    manager.decryptionKey = @"";
    manager.appkey = @"8272514d1d014cb3930a60fc3472419a";
    [manager setOnlineMode];
    [manager setLocateTimesSecond:5];
    [manager initLocationLibraryWithUUIDs:@[@"FDA50693-A4E2-4FB1-AFCF-C6EB07647825"]];
    [manager setDeflectionAngle:0];
    manager.delegate = self;
    [manager setUploadPosition:YES];
}
-(void)startListen:(CDVInvokedUrlCommand *)command{
    [[JSLocateManager sharedDefaults] start];
    self.callID = command.callbackId;
}
-(void)endListen:(CDVInvokedUrlCommand *)command{
    [[JSLocateManager sharedDefaults] stop];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:self.callID];
    self.callID = @"";
}
-(void)jsLocateManagerDidUpdateLocation:(JSPosition *)location sensorInfo:(NSString *)sensorInfo{
    if(location.errorCode == 0){
        //成功定位
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"x":@(location.x),@"y":@(location.y),@"floorID" :@(location.floorID),@"angula":@(self.angula)                                                            }];
        [result setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:result callbackId:self.callID];
    }
}
-(void)jsLocateManagerDidUpdateLocationManagerHeading:(CLHeading *)newHeading{
    double angule = 0;
    double cu = newHeading.magneticHeading;
    if(cu <= 90){angule = 180 - cu;}else if(cu >= 180){angule = 540 - cu;}else{angule = 3 * cu  - 180;};
    self.angula = angule;
}


@end
