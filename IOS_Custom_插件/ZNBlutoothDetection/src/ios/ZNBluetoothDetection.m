//
//  ZNBluetoothDetection.m
//  云上展馆
//
//  Created by space on 2017/11/20.
//

#import <UIKit/UIKit.h>
#import "ZNBluetoothDetection.h"
#import <CoreBluetooth/CoreBluetooth.h>
@interface ZNBluetoothDetection()<CBCentralManagerDelegate>
@property(nonatomic,strong)CBCentralManager *manager;
@property(nonatomic,copy)NSString *callID;
@end
@implementation ZNBluetoothDetection
-(void)pluginInitialize{}
-(void)startListenCentralUpdate:(CDVInvokedUrlCommand *)command{
    if(_manager == nil){
        self.callID = command.callbackId;
        self.manager = [[CBCentralManager alloc] initWithDelegate:self queue:dispatch_queue_create("com.zzh.yanzi", NULL)];
    }
    //处理当前蓝牙状态
    [self hanleCenterStatus];
}
-(void)openBluetoothSetting:(CDVInvokedUrlCommand *)command{
    NSURL *blutooth = [[NSURL alloc] initWithString:@"prefs:root=Bluetooth"];
    if([[UIApplication sharedApplication] canOpenURL:blutooth]){
        BOOL success = [[UIApplication sharedApplication]openURL:blutooth];
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:success];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }else{
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}
-(void)hanleCenterStatus{
     CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:self.manager.state];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:self.callID];
}
#pragma -mark CBCentralManagerDelegate
- (void)centralManagerDidUpdateState:(CBCentralManager *)central{
    [self hanleCenterStatus];
}
@end
