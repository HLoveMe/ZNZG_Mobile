//
//  JSPushManager.h  (v2.6.0新增)
//  JoysuchSDK
//
//  Created by seekcy on 2017/1/20.
//  Copyright © 2017年 com.joysuch. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSPushRegion.h"
#import "JSPushException.h"
#import "JSPushMessage.h"

@protocol JSPushManagerDelegate <NSObject>

// 成功连接
- (void)jsPushManagerDidConnectSuccess;

// 接收消息的回调
- (void)jsPushManagerOnRailPushMessage:(JSPushMessage *)message;

// 错误消息的回调
- (void)jsPushManagerOnExceptionMessage:(JSPushException *)exception;

@end

@interface JSPushManager : NSObject

@property (nonatomic, weak) id<JSPushManagerDelegate> delegate;

/*!
 *  @method pushManagerSharedDefaults
 *
 *  @discussion 单例
 *
 */
+ (JSPushManager *)pushManagerSharedDefaults;


/*!
 *  @method setPushRegion:
 *
 *
 *  @param  pushRegion  推送范围
 *
 *  @discussion 设置推送范围
 *
 */
- (void)setPushRegion:(JSPushRegion *)pushRegion;


/*!
 *  @method start
 *
 *  @discussion 开启推送服务
 *
 */
- (void)start;

/*!
 *  @method stop
 *
 *  @discussion 停止推送服务
 *
 */
- (void)stop;

@end

